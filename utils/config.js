const mainSlaves = process.env.SLAVE_IPS.split(",").filter((IP) => IP !== "");
const backupSlaves = process.env.BACKUP_SLAVE_IPS.split(",").filter(
  (IP) => IP !== ""
);

const totalSlaves = [
  ...mainSlaves.map((slave) => {
    return {
      type: "Main",
      server: slave,
    };
  }),
  ...backupSlaves.map((slave) => {
    return {
      type: "Backup",
      server: slave,
    };
  }),
];

module.exports = {
  env: "development",
  slaveServers: totalSlaves
};
