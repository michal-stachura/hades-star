import { CorporationDetails } from '@/types/corporation';

const useCorporationDetails = () => {
  const corporation = useState<CorporationDetails>('corporation')

  const setCorporationDetails = (data: CorporationDetails) => {
    corporation.value = data
  }

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

  const getWsStatus = (userId: string) => {
    if (corporation.value?.members) {
      const memberIdx = corporation.value.members.findIndex(obj => obj.id === userId)
      return corporation.value.members[memberIdx].nextWs
    }
  }

  return {
    corporation,
    setCorporationDetails,
    setWsStatus,
    getWsStatus,
    countMembers
  }
}

export default useCorporationDetails;