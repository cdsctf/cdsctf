pub mod entity;
pub mod util;

use std::time::Duration;

use anyhow::anyhow;
use once_cell::sync::OnceCell;
pub use sea_orm;
use sea_orm::{ConnectOptions, Database, DatabaseConnection, EntityTrait};
use tracing::info;

static DB: OnceCell<DatabaseConnection> = OnceCell::new();

pub async fn init() -> Result<(), anyhow::Error> {
    let url = format!(
        "postgres://{}:{}@{}:{}/{}",
        cds_env::get_config().db.username,
        cds_env::get_config().db.password,
        cds_env::get_config().db.host,
        cds_env::get_config().db.port,
        cds_env::get_config().db.dbname,
    );
    let mut opt = ConnectOptions::new(url);
    opt.max_connections(100)
        .min_connections(5)
        .connect_timeout(Duration::from_secs(8))
        .acquire_timeout(Duration::from_secs(8))
        .idle_timeout(Duration::from_secs(8))
        .max_lifetime(Duration::from_secs(8))
        .sqlx_logging(false)
        .set_schema_search_path("public");

    let db: DatabaseConnection = Database::connect(opt).await?;
    DB.set(db)
        .map_err(|_| anyhow!("Failed to set db into OnceCell."))?;
    info!("Database connection established successfully.");

    Ok(())
}

pub fn get_db() -> &'static DatabaseConnection {
    DB.get().unwrap()
}

pub async fn get_config() -> entity::config::Model {
    entity::config::Entity::find()
        .one(get_db())
        .await
        .unwrap()
        .unwrap()
}
