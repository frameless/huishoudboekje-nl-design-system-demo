terraform {
  source = "..\\..\\tofu\\keyvault"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

dependency "resource_group" {
  config_path = "../resource_group"
}

inputs = {
  name                = "kv-${include.locals.client}-${include.locals.environment}"
  location            = include.locals.globals.location
  resource_group_name = dependency.resource_group.outputs.name
  enable_rbac         = true
}