const {ethers}= require ("hardhat");

async function main(){
    const whitelistContract=await ethers.getContractFactory("WhiteList");

    const deployContract= await whitelistContract.deploy(10);

    await deployContract.deployed();

    console.log("Address",deployContract.address);

}

main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.log(error);
    process.exit(1);
});