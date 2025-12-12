
# TinyTrivia: Big Fun for Bright Minds 🧠✨

TinyTrivia is an interactive, AI-powered web application designed to create bespoke educational quizzes for children. 

By leveraging the **Google Gemini API**, TinyTrivia generates personalized questions based on a child's name, age, specific interests, and chosen learning topics.

## 🚀 Features

*   **🤖 AI-Powered**: Uses Gemini Flash to generate unique questions.
*   **🎨 Personalized**: Custom interests, age scaling, and "pop" aesthetic.
*   **🌍 Multi-Language**: Generate quizzes in any language.
*   **💾 Save & Share**: User accounts and shareable quiz links (via Supabase).
*   **🐳 Docker Ready**: Deploy anywhere with a single container.

## 🛠️ Tech Stack

*   **Frontend**: React (v19), TypeScript, Tailwind CSS
*   **Backend**: Supabase (Auth & Database)
*   **AI**: Google GenAI SDK
*   **Container**: Docker + Nginx

## 🐳 Docker Deployment

TinyTrivia is designed to be stateless and configurable at runtime.

### Option 1: Docker Compose (Recommended)

Create a `docker-compose.yml` file in your project directory:

```yaml
version: '3.8'

services:
  tinytrivia:
    image: ghcr.io/landcraft/tiny-trivia:main
    container_name: tinytrivia
    ports:
      - "8080:80"
    environment:
      - API_KEY=your_google_gemini_key
      - VITE_SUPABASE_URL=your_supabase_url
      - VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    restart: always
```

Run the application:
```bash
docker-compose up -d
```

### Option 2: Docker CLI

#### 1. Pull from GitHub Container Registry
```bash
docker pull ghcr.io/landcraft/tiny-trivia:main
```

#### 2. Run the Container
You must provide the necessary environment variables for the app to function.

```bash
docker run -d -p 8080:80 \
  -e API_KEY="your_google_gemini_key" \
  -e VITE_SUPABASE_URL="your_supabase_url" \
  -e VITE_SUPABASE_ANON_KEY="your_supabase_anon_key" \
  --name tinytrivia \
  ghcr.io/landcraft/tiny-trivia:main
```
Visit `http://localhost:8080` to see the app.

---

## ⚡ Supabase Setup (Required)

This app uses **Supabase** for user authentication and saving quizzes. While you can run the UI without it, the "Login" and "Save" features will not work.

### Why Supabase?
Supabase provides a complete backend (Postgres Database + Authentication + API) out of the box. Using a simple server-side database (like MySQL) would require writing a custom backend API server to handle secure login and data transmission, which adds significant complexity. Supabase keeps the architecture simple and robust.

### Setup Steps

1.  **Create Project**: Go to [Supabase](https://supabase.com/) and create a project named "TinyTrivia".
2.  **Get Credentials**:
    *   Go to **Project Settings -> API**.
    *   Copy **Project URL** (`VITE_SUPABASE_URL`)
    *   Copy **anon public key** (`VITE_SUPABASE_ANON_KEY`)
3.  **Setup Database**:
    *   Go to the **SQL Editor** in the Supabase dashboard.
    *   Paste and run the following SQL script to create the tables and security policies:

```sql
-- Create Quizzes Table
create table quizzes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text,
  child_name text,
  questions jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Security
alter table quizzes enable row level security;

-- Allow public read access (for sharing links)
create policy "Quizzes are public to view"
  on quizzes for select
  using ( true );

-- Allow authenticated users to create quizzes
create policy "Users can insert their own quizzes"
  on quizzes for insert
  with check ( auth.uid() = user_id );

-- Allow users to see their own quizzes in dashboard
create policy "Users can view own quizzes"
  on quizzes for select
  using ( auth.uid() = user_id );
```

4.  **Enable Google Sign-In**:
    *   Go to **Authentication -> Providers**.
    *   Enable **Google**.
    *   You will need a **Client ID** and **Secret** from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
    *   **Important**: In Google Cloud Console, add your Supabase Callback URL (found in the Supabase Provider settings) to "Authorized redirect URIs".
    *   **Important**: In Supabase **Authentication -> URL Configuration**, add your app's URL (e.g., `http://localhost:5173` for local, or your production URL) to **Site URL** or **Redirect URLs**.

## 📦 Local Development

1.  **Clone & Install**
    ```bash
    git clone https://github.com/landcraft/tiny-trivia.git
    npm install
    ```

2.  **Configure Env**
    Create a `.env` file:
    ```env
    API_KEY=your_key
    VITE_SUPABASE_URL=your_url
    VITE_SUPABASE_ANON_KEY=your_key
    ```

3.  **Run**
    ```bash
    npm run dev
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License.