-- QAZAQ HEROES: playable prototype schema. Run in Supabase SQL editor.
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username text not null check (char_length(username) between 1 and 24),
 avatar integer not null default 0 check (avatar between 0 and 5),
 level integer not null default 1, xp integer not null default 0 check(xp>=0),
 coins integer not null default 0 check(coins>=0), hero_stats jsonb not null default '{}',
 game_state jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.heroes(id text primary key,slug text unique not null,name text not null,category text not null,description text not null,portrait text,stats jsonb,abilities jsonb,unlock_requirement integer not null default 0);
create table public.missions(id text primary key,hero_id text references public.heroes(id),title text not null,description text,stages jsonb not null,reward_xp integer not null,reward_coins integer not null);
create table public.mission_progress(player_id uuid references public.profiles(id) on delete cascade,mission_id text references public.missions(id),stage integer default 0,completed boolean default false,updated_at timestamptz default now(),primary key(player_id,mission_id));
create table public.achievements(id text primary key,name text not null,description text);
create table public.player_achievements(player_id uuid references public.profiles(id) on delete cascade,achievement_id text references public.achievements(id),earned_at timestamptz default now(),primary key(player_id,achievement_id));
create table public.hero_unlocks(player_id uuid references public.profiles(id) on delete cascade,hero_id text references public.heroes(id),unlocked_at timestamptz default now(),primary key(player_id,hero_id));
create table public.daily_quests(id text primary key,title text not null,target integer,reward_xp integer,reward_coins integer);
create table public.player_daily_quests(player_id uuid references public.profiles(id) on delete cascade,quest_id text references public.daily_quests(id),quest_date date default current_date,progress integer default 0,claimed boolean default false,primary key(player_id,quest_id,quest_date));
create table public.leaderboard_scores(player_id uuid references public.profiles(id) on delete cascade,score_date date default current_date,xp integer default 0,primary key(player_id,score_date));
-- Content is public and read-only. Personal data belongs exclusively to its owner.
do $$ declare t text; begin
 foreach t in array array['profiles','heroes','missions','mission_progress','achievements','player_achievements','hero_unlocks','daily_quests','player_daily_quests','leaderboard_scores'] loop
 execute format('alter table public.%I enable row level security',t);
 end loop;
 foreach t in array array['heroes','missions','achievements','daily_quests'] loop
 execute format('create policy read_content on public.%I for select using (true)',t);
 end loop;
 foreach t in array array['mission_progress','player_achievements','hero_unlocks','player_daily_quests','leaderboard_scores'] loop
 execute format('create policy own_data on public.%I for all to authenticated using (auth.uid()=player_id) with check (auth.uid()=player_id)',t);
 end loop;
end $$;
create policy own_profile on public.profiles for all to authenticated using(auth.uid()=id) with check(auth.uid()=id);
-- A restricted projection exposes no user IDs, emails, or private profile state.
create view public.leaderboard_public as select username,avatar,xp,
 coalesce((select sum(s.xp) from public.leaderboard_scores s where s.player_id=p.id and s.score_date=current_date),0) as daily_xp,
 coalesce((select sum(s.xp) from public.leaderboard_scores s where s.player_id=p.id and s.score_date>=current_date-6),0) as weekly_xp
 from public.profiles p;
revoke all on public.leaderboard_public from public;
grant select on public.leaderboard_public to anon,authenticated;
-- Keep normalized progress tables synchronized with the saved game state.
create function public.sync_game_state() returns trigger language plpgsql security definer set search_path=public as $$
declare item text; q record; progress_item record; prior_xp integer; delta integer;
begin
 for progress_item in select key,value from jsonb_each_text(coalesce(new.game_state->'missionProgress','{}')) loop
 insert into mission_progress(player_id,mission_id,stage) select new.id,progress_item.key,greatest(0,progress_item.value::integer) where exists(select 1 from missions where id=progress_item.key) on conflict(player_id,mission_id) do update set stage=case when mission_progress.completed then 3 else excluded.stage end,updated_at=now();
 end loop;
 for item in select jsonb_array_elements_text(coalesce(new.game_state->'completed','[]')) loop
 insert into mission_progress(player_id,mission_id,stage,completed) select new.id,item,3,true where exists(select 1 from missions where id=item) on conflict(player_id,mission_id) do update set completed=true,stage=3,updated_at=now();
 end loop;
 for item in select jsonb_array_elements_text(coalesce(new.game_state->'achievements','[]')) loop
 insert into player_achievements(player_id,achievement_id) select new.id,item where exists(select 1 from achievements where id=item) on conflict do nothing;
 end loop;
 for item in select jsonb_array_elements_text(coalesce(new.game_state->'unlocked','[]')) loop
 insert into hero_unlocks(player_id,hero_id) select new.id,item where exists(select 1 from heroes where id=item) on conflict do nothing;
 end loop;
 for q in select * from daily_quests loop
 insert into player_daily_quests(player_id,quest_id,quest_date,progress,claimed) values(new.id,q.id,coalesce((new.game_state->'daily'->>'date')::date,current_date),coalesce((new.game_state->'daily'->>split_part(q.id,'-',1))::integer,0),coalesce(new.game_state->'daily'->'claimed','[]') ? q.id) on conflict(player_id,quest_id,quest_date) do update set progress=excluded.progress,claimed=excluded.claimed;
 end loop;
 prior_xp:=case when tg_op='INSERT' then 0 else old.xp end;
 delta:=greatest(0,new.xp-prior_xp);
 if delta>0 then insert into leaderboard_scores(player_id,score_date,xp) values(new.id,current_date,delta) on conflict(player_id,score_date) do update set xp=leaderboard_scores.xp+excluded.xp; end if;
 return new;
end $$;
create trigger sync_game after insert or update of game_state on public.profiles for each row execute function public.sync_game_state();
