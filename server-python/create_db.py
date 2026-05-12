import asyncio
import aiomysql
from core.config import get_settings

async def create_db():
    settings = get_settings()
    # Parse the URL to get host, user, password
    # mysql+aiomysql://root:@localhost:3306/beanbliss
    url = settings.MYSQL_URL.replace("mysql+aiomysql://", "")
    auth_part, rest = url.split("@")
    user, password = auth_part.split(":") if ":" in auth_part else (auth_part, "")
    host_port_db = rest.split("/")
    host_port = host_port_db[0].split(":")
    host = host_port[0]
    port = int(host_port[1]) if len(host_port) > 1 else 3306
    db_name = host_port_db[1]

    print(f"Connecting to MySQL at {host}:{port} as {user}...")
    try:
        conn = await aiomysql.connect(host=host, port=port, user=user, password=password)
        async with conn.cursor() as cur:
            await cur.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
            print(f"Database '{db_name}' created or already exists.")
        conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")

if __name__ == "__main__":
    asyncio.run(create_db())
