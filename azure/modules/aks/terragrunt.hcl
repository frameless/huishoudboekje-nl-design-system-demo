terraform {
  source = "..\\..\\tofu\\aks"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

dependency "resource_group" {
  config_path = "../resource_group"
}

inputs = {
  location             = include.locals.globals.location
  resource_group_id    = dependency.resource_group.outputs.id
  resource_group_name  = dependency.resource_group.outputs.name
  name                 = "aks-hhb-review"
  dns_prefix           = "hhb"
  ssh_key_name         = "aks-ssh-review"
  vm_size              = "Standard_B2als_v2"
  default_pool_vm_size = "Standard_B2als_v2"
  admin_username       = "hhbreview"
  max_nodes            = 5
  min_nodes            = 0
  vnet_name            = "vnet-k8s-review"
  subnet_name          = "subnet-k8s-review"
}
