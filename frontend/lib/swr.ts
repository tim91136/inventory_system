export const fetcher = async (...args) => {
    const res = await fetch(...args)


    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.')
        error.status = res.status
        // Attach extra info to the error object.
        try {
            error.message = await res.json()
        } catch  {
            error.message = "error message not json decodable"
        }

        throw error
    }

    return await res.json()

}