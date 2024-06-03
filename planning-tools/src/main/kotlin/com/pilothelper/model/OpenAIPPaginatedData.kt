package com.pilothelper.model

import kotlinx.serialization.Serializable

/**
 * Paginated data as returned by the OpenAIP API
 */
@Serializable
data class OpenAIPPaginatedData<T>(
    val limit: Int,
    val totalCount: Int,
    val totalPages: Int,
    val page: Int,
    val items: List<T>,
)
