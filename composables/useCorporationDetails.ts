import { CorporationDetails } from '@/types/corporation';

const useCorporationDetails = () => {
  const corporation = useState<CorporationDetails | undefined>('corporation', undefined)

  const countMembers = (statuses: string[]) => {
    if (statuses.length > 0) {
      return corporation.value?.members?.reduce((counter, currObj) => statuses.includes(currObj.nextWs) ? ++counter : counter, 0) || 0
    }
    return corporation.value?.members?.length || 0
  }

  const setWsStatus = (userId: string, status: string) => {
    if (corporation.value?.members) {
      const memberIdx = corporation.value.members.findIndex(obj => obj.id === userId)
      corporation.value.members[memberIdx].nextWs = status
    }
  }
  
  const clearWsStatus = (userId: string) => {
    if (corporation.value?.members) {
      const memberIdx = corporation.value.members.findIndex(obj => obj.id === userId)
      corporation.value.members[memberIdx].nextWs = '-'
    }
  }

  return {
    corporation,
    setWsStatus,
    clearWsStatus,
    countMembers
  }
}

export default useCorporationDetails;