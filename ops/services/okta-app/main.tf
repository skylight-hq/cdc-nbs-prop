locals {
  dev_urls = [
    "http://localhost:8080",
    "http://localhost:9090",
    "http://localhost:3000",
    "https://simple-report.app.cloud.gov/",
    "https://prime-data-input-sandbox-backend.app.cloud.gov/"
  ]
}


resource "okta_app_oauth" "app" {
  label = "Simple Report (${var.env})"
  type = "web"
  grant_types = [
    "authorization_code",
    "implicit"]
  redirect_uris = concat(local.dev_urls, [
    "https://${var.env}.simplereport.org/app"])
  response_types = [
    "code",
    "id_token",
    "token"]
  login_uri = "https://prime-data-input-sandbox-backend.app.cloud.gov/"

  lifecycle {
    ignore_changes = [
      groups
    ]
  }
}

// Create the custom app mappings

resource "okta_app_user_schema" "org_schema" {
  app_id = okta_app_oauth.app.id
  index = "simple_report_org"
  title = "Healthcare Organization"
  description = "Associated Healthcare Organization"
  type = "string"
  master = "PROFILE_MASTER"
}

resource "okta_app_user_schema" "user_schema" {
  app_id = okta_app_oauth.app.id
  index = "simple_report_user"
  title = "User Type"
  description = "Whether or not the user is an administrator"
  type = "string"
  master = "PROFILE_MASTER"
}

resource "okta_app_group_assignment" "users" {
  count = length(var.user_groups)
  app_id = okta_app_oauth.app.id
  group_id = element(var.user_groups, count.index)
}

// Link the CDC/USDS users to the application
data "okta_group" "cdc_users" {
  name = "Prime Team Members"
}

resource "okta_app_group_assignment" "prime_users" {
  app_id = okta_app_oauth.app.id
  group_id = data.okta_group.cdc_users.id
}