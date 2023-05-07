export default defineNuxtRouteMiddleware((to, from) => {
  const { currentCorporationId, incorrectSecret } = useCorporationDetails();
  const pageNames: string[] = [
    'corporations-id',
    'corporations-id-filters'
  ]
  
  if (pageNames.includes(to.name as string)) {
    currentCorporationId.value = typeof(to.params.id) === 'string' ? to.params.id : to.params.id[0]
  } else {
    incorrectSecret.value = false;
    currentCorporationId.value = '';
  }
})

