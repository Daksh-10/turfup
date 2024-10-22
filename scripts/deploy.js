// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const RealEstate = await ethers.getContractFactory("RealEstate");
  const realEstate = await RealEstate.deploy();
  await realEstate.deployed(); // Ensure this line is correct
  console.log("RealEstate contract deployed to:", realEstate.address);

  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(
    realEstate.address, // Address of the RealEstate contract
    deployer.address, // Seller address
    deployer.address, // Inspector address
    deployer.address // Lender address
  );
  await escrow.deployed();
  console.log("Escrow contract deployed to:", escrow.address);
}

main()
  .then(() => process.exit(1))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
