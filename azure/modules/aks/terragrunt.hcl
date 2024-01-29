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
  default_pool_vm_size = "Standard_B2als_v2"
  node_pools = [
    {
      name                = "reviewpool",
      vm_size             = "Standard_E2as_v5"
      max_nodes           = 1
      enable_auto_scaling = false
      labels = {
        deployment = "review"
      }
    },
    {
      name                = "scalepool"
      vm_size             = "Standard_B2als_v2"
      max_nodes           = 5
      min_nodes           = 0
      enable_auto_scaling = true
      labels = {
        deployment = "review"
      }
    }
  ]
  admin_username = "hhbreview"
  vnet_name      = "vnet-k8s-review"
  subnet_name    = "subnet-k8s-review"
}
