import https from "https";
import cron from "cron";
const serverUrl = "https://fsc-backend.onrender.com/user/data";

export const job = new cron.CronJob("*/14 * * * * ", () => {
  // Every 14 minutes
  console.log("restarting server....");
  // This will hit every api endpoint
  https
    .get(serverUrl, (res) => {
      const { statusCode } = res;

      if (statusCode !== 200) {
        console.error(
          `Error: Unable to keep server alive. Status Code: ${statusCode}`
        );
      } else {
        console.log("Server kept alive successfully.");
      }
    })
    .on("error", (error) => {
      console.error(`Error during restart: ${error.message}`);
    });
});
