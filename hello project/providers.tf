provider "azurerm" {
  features {}

  tenant_id       = "687bbf51-433c-425f-a802-91290c993f57"
  subscription_id = "3c850cea-049e-4bff-a039-406dc6fafa3c"
  client_id       = "478a6218-74a3-4798-ae56-34a99d9e1174"

}

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.62.1"
    }
  }
}
