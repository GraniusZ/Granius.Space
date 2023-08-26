export const time = (timestamp: number | undefined): Date => {
	if (!timestamp ){
        return  new Date()
    }
    return new Date(timestamp)
}
