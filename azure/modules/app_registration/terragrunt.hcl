terraform {
  source = "..\\..\\tofu\\app_registration"
}

include {
  path   = find_in_parent_folders()
  expose = true
}

inputs = {
  name = "app-${include.locals.client}-${include.locals.environment}"
  redirect_uris = [
    "https://test.hhb-development.nl/auth/callback"
  ]
}