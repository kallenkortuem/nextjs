import { useRouter } from 'next/router'

const MasterySummonerNames = () => {
  const router = useRouter()
  const { summonerNames } = router.query
  if (!Array.isArray(summonerNames)) {
    return null;
  }

  return <p>Post: {summonerNames}</p>
}

export default MasterySummonerNames