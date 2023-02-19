import { CorporationDetails } from '@/types/corporation';
import { Member } from '@/types/member';

const useCorporationDetails = () => {
  const corporation = useState<CorporationDetails | null>('corporation')

  const setCorporationDetails = (data: CorporationDetails) => {
    corporation.value = data;
    sortMembersByName();
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

  const getCorporationSecret = (corporationId: string):string => {
    let corporationSecret = '';
    if (process.client) {
      corporationSecret = localStorage.getItem(corporationId) || '';
      if (corporationSecret !== '') {
        corporationSecret = JSON.parse(corporationSecret).secret || '';
      }
    }
    return corporationSecret;
  }

  const setCorporationSecret = (secret: String, corporationId: String) => {
    localStorage.setItem(corporationId.toString(), JSON.stringify({secret: secret}))
  }

  const updateCorporationMember = (member: Member) => {
    if (corporation.value && corporation.value.members) {
      const memberIdx = corporation.value.members.findIndex(obj => obj.id === member.id)

      corporation.value.members[memberIdx] = member
    }
  }

  const addCorporationMember = (member: Member) => {
    if (corporation.value && corporation.value.members) {
      corporation.value.members.push(member)

      sortMembersByName();
    }
  }

  const deleteCorporationMember = (memberId: string) => {
    if (corporation.value && corporation.value.members) {
      const memberIdx = corporation.value.members.findIndex(obj => obj.id === memberId)
      if (memberIdx > -1) {
        corporation.value.members.splice(memberIdx, 1);
      }
    }
  }

  const sortMembersByName = () => {
    if (corporation.value && corporation.value.members) {
      // sort by name
      corporation.value.members.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;  // equal names
      })
    }
  }

  return {
    corporation,
    setCorporationDetails,
    setWsStatus,
    getWsStatus,
    countMembers,
    getCorporationSecret,
    setCorporationSecret,
    updateCorporationMember,
    addCorporationMember,
    deleteCorporationMember,
  }
}

export default useCorporationDetails;