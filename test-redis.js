role_assignments = concat(
  tolist(lookup(local.identity_settings[each.key], "role_assignments", [])),
  [{
    role              = "Owner"
    group_name        = var.admin_group_name
    principal_id      = var.admin_group_id
  }]
)