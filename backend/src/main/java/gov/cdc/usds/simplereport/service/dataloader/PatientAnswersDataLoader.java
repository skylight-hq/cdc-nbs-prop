package gov.cdc.usds.simplereport.service.dataloader;

import gov.cdc.usds.simplereport.db.model.PatientAnswers;
import gov.cdc.usds.simplereport.db.model.TestOrder;
import gov.cdc.usds.simplereport.db.repository.PatientAnswersRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class PatientAnswersDataLoader extends KeyedDataLoaderFactory<TestOrder, PatientAnswers> {
  public static final String KEY = "testOrder[*].patientAnswers";

  @Override
  public String getKey() {
    return KEY;
  }

  PatientAnswersDataLoader(PatientAnswersRepository patientAnswersRepository) {
    super(
        testOrders ->
            CompletableFuture.supplyAsync(
                () -> {
                  List<UUID> patientAnswerIds =
                      testOrders.stream()
                          .map(TestOrder::getPatientAnswersId)
                          .collect(Collectors.toList());

                  Map<UUID, PatientAnswers> found =
                      patientAnswersRepository.findAllByInternalIdIn(patientAnswerIds).stream()
                          .collect(
                              Collectors.toMap(PatientAnswers::getInternalId, Function.identity()));

                  return testOrders.stream()
                      .map(to -> found.getOrDefault(to.getPatientAnswersId(), null))
                      .collect(Collectors.toList());
                }));
  }
}
