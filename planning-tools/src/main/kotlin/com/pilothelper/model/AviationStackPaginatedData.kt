package com.pilothelper.model

import kotlinx.serialization.Serializable

/**
 * Paginated data as returned by the AviationStack API
 */
@Serializable
data class AviationStackPaginatedData<T>(
    val pagination: Pagination,
    val data: List<T>
) {
    @Serializable
    data class Pagination(
        val offset: Int,
        val limit: Int,
        val count: Int,
        val total: Int,
    )
}
