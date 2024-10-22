// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer, owner, buyer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const RealEstate = await ethers.getContractFactory("RealEstate");
  const realEstate = await RealEstate.deploy();
  await realEstate.waitForDeployment();
  const address = await realEstate.getAddress();
  console.log(
    "RealEstate contract deployed to:",
    await realEstate.getAddress()
  );

  let transaction = await realEstate.connect(owner).createProperty(100);
  await transaction.wait();

  console.log(await realEstate.uri(0));

  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(
    address, // Address of the RealEstate contract
    deployer.address, // Seller address
    deployer.address, // Inspector address
    deployer.address // Lender address
  );
  await escrow.waitForDeployment();
  console.log("Escrow contract deployed to:", await escrow.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
