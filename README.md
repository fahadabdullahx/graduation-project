# EasyRides

EasyRides is a modern carpooling application designed to connect drivers with passengers traveling in the same direction. This platform facilitates shared rides, reducing transportation costs and environmental impact while building community connections.

# DATABASE

## Tables

### TRIPS

| Column Name     | Type     |
| --------------- | -------- |
| id              | uuid     |
| driver_id       | uuid     |
| start_location  | string   |
| end_location    | string   |
| start_latitude  | numeric  |
| start_longitude | numeric  |
| end_latitude    | numeric  |
| end_longitude   | numeric  |
| departure_time  | dateTime |
| status          | string   |
| offered_seat    | integer  |
| created_at      | dateTime |
| price           | real     |
| amenities       | float    |
| car             | uuid     |

### STOP POINTS

| Column Name | Type     |
| ----------- | -------- |
| id          | uuid     |
| created_at  | dataTime |
| latitude    | numeric  |
| longitude   | numeric  |
| status      | string   |
| user_id     | uuid     |
| trip_id     | uuid     |
| booking_id  | uuid     |

### REVIEWS

| Column     | Type     |
| ---------- | -------- |
| id         | uuid     |
| created_at | dateTime |
| user_id    | uuid     |
| for_id     | uuid     |
| trip_id    | uuid     |
| rating     | float    |
| comment    | string   |

### REQUESTS

| Column       | Type     |
| ------------ | -------- |
| id           | uuid     |
| created_at   | dateTime |
| user_id      | uuid     |
| request_type | string   |
| data         | json     |
| status       | string   |

### PROFILES

| Column       | Type     |
| ------------ | -------- |
| id           | uuid     |
| created_at   | dateTime |
| full_name    | string   |
| avatar_url   | string   |
| phone_number | numeric  |
| gender       | string   |
| rating       | float    |

### NOTIFICATIONS

| Column     | Type     |
| ---------- | -------- |
| id         | uuid     |
| created_at | dateTime |
| type       | string   |
| title      | string   |
| body       | string   |
| user_id    | uuid     |
| url        | string   |
| is_read    | boolean  |

### CHATS

| Column     | Type     |
| ---------- | -------- |
| id         | uuid     |
| created_at | dateTime |
| user_id    | uuid     |
| for_id     | uuid     |
| trip_id    | uuid     |
| message    | string   |

### CARS

| Column     | Type     |
| ---------- | -------- |
| id         | uuid     |
| created_at | dateTime |
| owner      | uuid     |
| color      | string   |
| model      | string   |
| year       | number   |
| seat       | number   |
| type       | string   |

### BOOKINGS

| Column     | Type     |
| ---------- | -------- |
| id         | uuid     |
| created_at | dateTime |
| trip_id    | uuid     |
| user_id    | uuid     |
| seat       | number   |
| status     | string   |

### Database Functions

### new user

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  phone_number text,
  gender text,
  Rating text
);

create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, phone_number, gender)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url',new.raw_user_meta_data->>'phone_number',new.raw_user_meta_data->>'gender');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');
```

### search trips by locations

```sql

CREATE OR REPLACE FUNCTION search_trips_by_locations(
    user_start_lat DOUBLE PRECISION,
    user_start_lng DOUBLE PRECISION,
    user_end_lat DOUBLE PRECISION,
    user_end_lng DOUBLE PRECISION,
    search_radius INT
)
RETURNS TABLE (trip_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id
    FROM trips t
    WHERE ST_DWithin(
        ST_SetSRID(ST_MakePoint(t.start_longitude, t.start_latitude), 4326)::geography,
        ST_SetSRID(ST_MakePoint(user_start_lng, user_start_lat), 4326)::geography,
        search_radius
    )
    AND ST_DWithin(
        ST_SetSRID(ST_MakePoint(t.end_longitude, t.end_latitude), 4326)::geography,
        ST_SetSRID(ST_MakePoint(user_end_lng, user_end_lat), 4326)::geography,
        search_radius
    );
END;
$$ LANGUAGE plpgsql;
```

### user ratings

```sql
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET rating = (SELECT AVG(rating) FROM reviews WHERE for_id = NEW.for_id)
    WHERE id = NEW.for_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_profile_rating();

```

## TECHNOLOGIES USED

### Frontend

- **Next.js** - React framework with server-side rendering capabilities
- **React** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library built on Tailwind
- **Lucide React** - Icon library
- **Leaflet** - JavaScript library for interactive maps
- **Leaflet Routing Machine** - Adds routing capabilities to Leaflet maps

### Backend

- **Next.js API/ACTIONS** - Serverless functions for backend logic
- **Supabase** - Backend-as-a-Service platform

### Database

- **PostgreSQL** - Relational database
- **PostGIS** - Spatial database extension (for location-based queries)

### Mapping & Geolocation

- **OpenStreetMap** - Map data source
- **Geospatial queries** - For finding nearby trips and locations

### Deployment

- **Vercel** - Platform for Next.js deployment and hosting
- **Supabase Platform** - Hosting for the database

## ENV

#### website url

NEXT_PUBLIC_BASE_URL

#### supabase

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

#### stripe

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
