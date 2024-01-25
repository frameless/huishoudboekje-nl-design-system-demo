locals {
  env         = read_terragrunt_config("${get_parent_terragrunt_dir()}/environments/${local.environment}/env.hcl").locals
  globals     = read_terragrunt_config("${get_parent_terragrunt_dir()}/globals.hcl").locals
  module      = replace(path_relative_to_include(), "modules/", "")
  environment = "review"
  client      = "hhb"
}

inputs = {
  location = local.globals.location
}

remote_state {
  backend = "azurerm"
  config = {
    key                  = "${local.module}/terraform.tfstate"
    container_name       = "tfstate"
    resource_group_name  = "rg-${local.client}-tf-${local.environment}"
    storage_account_name = "st${local.client}tf${local.environment}"
  }
}