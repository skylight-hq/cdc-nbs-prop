package gov.cdc.usds.simplereport.db.repository;

import gov.cdc.usds.simplereport.db.model.PatientAnswers;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface PatientAnswersRepository extends DeletableEntityRepository<PatientAnswers> {
  List<PatientAnswers> findAllByInternalIdIn(Collection<UUID> internalId);
}
