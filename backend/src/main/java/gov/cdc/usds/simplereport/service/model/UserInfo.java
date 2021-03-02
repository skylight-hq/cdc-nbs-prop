package gov.cdc.usds.simplereport.service.model;

import gov.cdc.usds.simplereport.config.authorization.OrganizationRole;
import gov.cdc.usds.simplereport.config.authorization.UserPermission;
import gov.cdc.usds.simplereport.db.model.ApiUser;
import gov.cdc.usds.simplereport.db.model.Organization;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class UserInfo {

  private ApiUser wrapped;
  private Optional<Organization> org;
  private boolean isAdmin;
  private String roleDescription;
  private List<UserPermission> permissions;
  private List<OrganizationRole> roles;

  public UserInfo(ApiUser user, Optional<OrganizationRoles> orgwrapper, boolean isAdmin) {
    this.wrapped = user;
    this.org = orgwrapper.map(OrganizationRoles::getOrganization);
    this.permissions = new ArrayList<>();
    this.roles =
        orgwrapper.map(OrganizationRoles::getGrantedRoles).orElse(Set.of()).stream()
            .collect(Collectors.toList());
    Optional<OrganizationRole> effectiveRole =
        orgwrapper.flatMap(OrganizationRoles::getEffectiveRole);
    this.roleDescription = buildRoleDescription(effectiveRole, isAdmin);
    effectiveRole.map(OrganizationRole::getGrantedPermissions).ifPresent(permissions::addAll);
    this.isAdmin = isAdmin;
  }

  private String buildRoleDescription(Optional<OrganizationRole> role, boolean isAdmin) {
    if (role.isPresent()) {
      String desc = role.get().getDescription();
      return isAdmin ? desc + " (SU)" : desc;
    } else {
      return isAdmin ? "Super Admin" : "Misconfigured user";
    }
  }

  public UUID getId() {
    return wrapped.getInternalId();
  }

  public Optional<Organization> getOrganization() {
    return org;
  }

  public String getFirstName() {
    return wrapped.getNameInfo().getFirstName();
  }

  public String getMiddleName() {
    return wrapped.getNameInfo().getMiddleName();
  }

  public String getLastName() {
    return wrapped.getNameInfo().getLastName();
  }

  public String getSuffix() {
    return wrapped.getNameInfo().getSuffix();
  }

  // Note: we assume a user's email and login username are the same thing.
  public String getEmail() {
    return wrapped.getLoginEmail();
  }

  public boolean getIsAdmin() {
    return isAdmin;
  }

  public List<UserPermission> getPermissions() {
    return permissions;
  }

  public String getRoleDescription() {
    return roleDescription;
  }

  public List<OrganizationRole> getRoles() {
    return roles;
  }
}