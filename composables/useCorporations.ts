import { Corporation } from '@/types/corporation';

const useCorporations = () => {
  const corporations = useState<Corporation[]>('corporations', () => []);

  return {
    corporations,
  };
};

export default useCorporations;