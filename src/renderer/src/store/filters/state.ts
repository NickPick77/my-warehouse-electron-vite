export interface FiltersStateType {
  searchQuery: string
}

export const filtersState = () => {
  return (): FiltersStateType => ({
    searchQuery: ''
  })
}
