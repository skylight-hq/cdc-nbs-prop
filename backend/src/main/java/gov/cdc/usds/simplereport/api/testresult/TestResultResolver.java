package gov.cdc.usds.simplereport.api.testresult;

import gov.cdc.usds.simplereport.api.Translators;
import gov.cdc.usds.simplereport.api.model.OrganizationLevelDashboardMetrics;
import gov.cdc.usds.simplereport.api.model.TopLevelDashboardMetrics;
import gov.cdc.usds.simplereport.db.model.TestEvent;
import gov.cdc.usds.simplereport.db.model.TestResultUpload;
import gov.cdc.usds.simplereport.service.TestOrderService;
import gov.cdc.usds.simplereport.service.TestResultUploadService;
import gov.cdc.usds.simplereport.service.errors.InvalidBulkTestResultUploadException;
import gov.cdc.usds.simplereport.service.errors.InvalidRSAPrivateKeyException;
import gov.cdc.usds.simplereport.service.model.reportstream.UploadResponse;
import graphql.kickstart.tools.GraphQLMutationResolver;
import graphql.kickstart.tools.GraphQLQueryResolver;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TestResultResolver implements GraphQLQueryResolver, GraphQLMutationResolver {

  private final TestOrderService tos;
  private final TestResultUploadService testResultUploadService;

  public List<TestEvent> getTestResults(
      UUID facilityId,
      UUID patientId,
      String result,
      String role,
      Date startDate,
      Date endDate,
      int pageNumber,
      int pageSize) {
    if (pageNumber < 0) {
      pageNumber = TestOrderService.DEFAULT_PAGINATION_PAGEOFFSET;
    }
    if (pageSize < 1) {
      pageSize = TestOrderService.DEFAULT_PAGINATION_PAGESIZE;
    }

    if (facilityId == null) {
      return tos.getAllFacilityTestEventsResults(
          patientId,
          Translators.parseTestResult(result),
          Translators.parsePersonRole(role, true),
          startDate,
          endDate,
          pageNumber,
          pageSize);
    }
    return tos.getTestEventsResults(
        facilityId,
        patientId,
        Translators.parseTestResult(result),
        Translators.parsePersonRole(role, true),
        startDate,
        endDate,
        pageNumber,
        pageSize);
  }

  public int testResultsCount(
      UUID facilityId, UUID patientId, String result, String role, Date startDate, Date endDate) {
    return tos.getTestResultsCount(
        facilityId,
        patientId,
        Translators.parseTestResult(result),
        Translators.parsePersonRole(role, true),
        startDate,
        endDate);
  }

  public TestEvent correctTestMarkAsError(UUID id, String reasonForCorrection) {
    return tos.markAsError(id, reasonForCorrection);
  }

  public TestEvent correctTestMarkAsCorrection(UUID id, String reasonForCorrection) {
    return tos.markAsCorrection(id, reasonForCorrection);
  }

  public TestEvent getTestResult(UUID id) {
    return tos.getTestResult(id);
  }

  public OrganizationLevelDashboardMetrics getOrganizationLevelDashboardMetrics(
      Date startDate, Date endDate) {
    return tos.getOrganizationLevelDashboardMetrics(startDate, endDate);
  }

  public TopLevelDashboardMetrics getTopLevelDashboardMetrics(
      UUID facilityId, Date startDate, Date endDate) {
    return tos.getTopLevelDashboardMetrics(facilityId, startDate, endDate);
  }

  public UploadResponse getUploadSubmission(UUID id)
      throws InvalidBulkTestResultUploadException, InvalidRSAPrivateKeyException {
    return testResultUploadService.getUploadSubmission(id);
  }

  public Page<TestResultUpload> getUploadSubmissions(
      Date startDate, Date endDate, int pageNumber, int pageSize) {
    return testResultUploadService.getUploadSubmissions(startDate, endDate, pageNumber, pageSize);
  }
}
