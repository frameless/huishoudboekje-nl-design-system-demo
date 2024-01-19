output "application_id" {
  value = azuread_application.application.application_id
}

output "default_role" {
  value = azuread_application.application.app_role_ids["Default.Access"]
}

output "client_secret" {
    value = azuread_application_password.secret.value
    sensitive = true
}