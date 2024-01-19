terraform {
  source = "..\\..\\tofu\\resource_group"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

inputs = {
  name = "rg-${include.locals.client}-${include.locals.environment}"
}