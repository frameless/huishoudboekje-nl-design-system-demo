variable "name" {
  type        = string
  description = "The name to use for the application created to verify AAD authorization"
}

variable "redirect_uris" {
    type = list(
        string
    )
    description = "The redirect_uris that can receive a response from this App Registration, defaults to []"
    default = []
}

variable "owners" {
    type = list(string)
    description = "The owners for this application, defaults to []"
    default = []
}