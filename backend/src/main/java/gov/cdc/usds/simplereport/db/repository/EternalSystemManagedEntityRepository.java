package gov.cdc.usds.simplereport.db.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.CrudRepository;

import gov.cdc.usds.simplereport.db.model.EternalSystemManagedEntity;

/**
 * Base repository interface for soft-deletable entities. Should implement all CRUD operations, but with
 * restrictions against unintentionally retrieving soft-deleted items.
 *
 * @param <T> a soft-delete-only subclass of {@link EternalSystemManagedEntity}.
 */
@NoRepositoryBean
public interface EternalSystemManagedEntityRepository<T extends EternalSystemManagedEntity> extends CrudRepository<T, UUID> {

    public static final String BASE_QUERY = "from #{#entityName} e where e.isDeleted = false ";

    @Override
    @Query(BASE_QUERY)
    public List<T> findAll();

    @Override
    @Modifying// (flushAutomatically = true) // probably not? It's not clear when this would arise actually
    @Query("update #{#entityName} e set e.isDeleted = true where e = :victim")
    public void delete(T victim);

}
