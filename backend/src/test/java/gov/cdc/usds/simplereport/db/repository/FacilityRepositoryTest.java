package gov.cdc.usds.simplereport.db.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import gov.cdc.usds.simplereport.db.model.DeviceSpecimenType;
import gov.cdc.usds.simplereport.db.model.DeviceType;
import gov.cdc.usds.simplereport.db.model.Facility;
import gov.cdc.usds.simplereport.db.model.Organization;
import gov.cdc.usds.simplereport.db.model.Provider;
import gov.cdc.usds.simplereport.db.model.SpecimenType;
import gov.cdc.usds.simplereport.test_util.TestDataFactory;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class FacilityRepositoryTest extends BaseRepositoryTest {

  @Autowired private DeviceTypeRepository _devices;
  @Autowired private DeviceSpecimenTypeRepository _deviceSpecimens;
  @Autowired private SpecimenTypeRepository _specimens;
  @Autowired private ProviderRepository _providers;
  @Autowired private OrganizationRepository _orgs;
  @Autowired private FacilityRepository _repo;
  @Autowired private TestDataFactory _dataFactory;

  @Test
  void smokeTestDeviceOperations() {
    List<DeviceType> configuredDevices = new ArrayList<>();
    DeviceType bill = _devices.save(new DeviceType("Bill", "Weasleys", "1", "12345-6", "E", 15));
    DeviceType percy = _devices.save(new DeviceType("Percy", "Weasleys", "2", "12345-7", "E", 15));
    SpecimenType spec = _specimens.save(new SpecimenType("Troll Bogies", "0001111234"));
    DeviceSpecimenType billbogies = _deviceSpecimens.save(new DeviceSpecimenType(bill, spec));
    Provider mccoy =
        _providers.save(new Provider("Doc", "", "", "", "NCC1701", null, "(1) (111) 2222222"));
    configuredDevices.add(bill);
    configuredDevices.add(percy);
    Organization org = _orgs.save(new Organization("My Office", "other", "650Mass", true));
    Facility saved =
        _repo.save(
            new Facility(
                org,
                "Third Floor",
                "123456",
                _dataFactory.getAddress(),
                "555-867-5309",
                "facility@test.com",
                mccoy,
                billbogies,
                configuredDevices));
    Optional<Facility> maybe = _repo.findByOrganizationAndFacilityName(org, "Third Floor");
    assertTrue(maybe.isPresent(), "should find the facility");
    Facility found = maybe.get();
    assertEquals(2, found.getDeviceTypes().size());
    found.addDefaultDeviceSpecimen(billbogies);
    _repo.save(found);
    found = _repo.findById(saved.getInternalId()).get();
    found.removeDeviceType(bill);
    _repo.save(found);
    found = _repo.findById(saved.getInternalId()).get();
    assertNull(found.getDefaultDeviceType());
    assertEquals(1, found.getDeviceTypes().size());
  }

  @Test
  void facilityAddDeviceType_backwardCompatibleWithFacilityDeviceSpecimenType() {
    // GIVEN
    var facilityDeviceSpecimenType = _dataFactory.getGenericDeviceSpecimen();
    var org = _dataFactory.createValidOrg();
    var facility = _dataFactory.createValidFacility(org);
    facility.getDeviceTypes().forEach(facility::removeDeviceType);
    assertThat(facility.getDeviceTypes()).isEmpty();

    // WHEN only a facility device specimen type is configured
    facility.addDeviceSpecimenType(facilityDeviceSpecimenType);
    _repo.save(facility);

    // THEN
    assertThat(facility.getDeviceTypes()).hasSize(1);
    assertThat(facility.getDeviceTypes()).contains(facilityDeviceSpecimenType.getDeviceType());

    // WHEN adding a new device
    facility.addDeviceType(new DeviceType("New Shiny Device", "Nue Inc", "Shiny", "123", null, 15));

    // THEN
    assertThat(facility.getDeviceTypes()).hasSize(2);

    // WHEN Deleting a device
    facility.removeDeviceType(facilityDeviceSpecimenType.getDeviceType());

    // THEN
    assertThat(facility.getDeviceTypes()).hasSize(1);
    DeviceType device = facility.getDeviceTypes().get(0);
    assertThat(device.getName()).isEqualTo("New Shiny Device");
    assertThat(device.getManufacturer()).isEqualTo("Nue Inc");
    assertThat(device.getModel()).isEqualTo("Shiny");
  }

  @Test
  void facilityRemoveDeviceType_backwardCompatibleWithFacilityDeviceSpecimenType() {
    // GIVEN
    var facilityDeviceSpecimenType = _dataFactory.getGenericDeviceSpecimen();
    var org = _dataFactory.createValidOrg();
    var facility = _dataFactory.createValidFacility(org);
    facility.getDeviceTypes().forEach(facility::removeDeviceType);
    assertThat(facility.getDeviceTypes()).isEmpty();

    // WHEN only a facility device specimen type is configured
    facility.addDeviceSpecimenType(facilityDeviceSpecimenType);
    _repo.save(facility);

    // THEN
    assertThat(facility.getDeviceTypes()).hasSize(1);
    assertThat(facility.getDeviceTypes()).contains(facilityDeviceSpecimenType.getDeviceType());

    // WHEN Deleting a device
    facility.removeDeviceType(facilityDeviceSpecimenType.getDeviceType());

    // THEN
    assertThat(facility.getDeviceTypes()).isEmpty();
  }
}
