use axum::Router;
use tower_http::services::ServeFile;

pub fn router() -> Router {
    Router::new().fallback_service(
        tower_http::services::ServeDir::new(&cds_env::get_config().server.frontend)
            .precompressed_gzip()
            .not_found_service(ServeFile::new(format!(
                "{}/index.html",
                cds_env::get_config().server.frontend
            ))),
    )
}
