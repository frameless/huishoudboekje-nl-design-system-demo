terraform {
  source = "..\\..\\tofu\\keyvault_secret_put"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

dependency "keyvault" {
  config_path = "../keyvault"
}

dependency "application" {
  config_path = "../app_registration"
}

inputs = {
  key_vault_id = dependency.keyvault.outputs.id
  secret_name  = "app-reg-client-secret"
  secret_value = dependency.application.outputs.client_secret
}