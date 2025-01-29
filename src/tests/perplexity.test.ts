
import dotenv from 'dotenv';
import { checkClaimsWithJournals, getClaimsByInfluencer } from '../services/perplexity';
dotenv.config();

jest.setTimeout(100000);
describe('Perplexity API', () => {
    // ... existing code ...
    
    it('should get claims and check them with journals', async () => {
        const name = "Andrew Huberman";
        const journals = [
            "PUBMed Centeral 2023;12(3):123-145",
            "The LANCET 2022;8(2):78-92"
        ];
        
        // First get the claims
        const claims = await getClaimsByInfluencer(name, 50);
        console.log(claims);
        
        const checkedClaims = await checkClaimsWithJournals(claims, journals);
        console.log(checkedClaims);
    });
});
