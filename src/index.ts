import colors from "colors";
import environments from "./configurations/environments";
import app from "./server";

const port = environments.PORT;

app.listen(port, () => {
  console.log(colors.cyan.bold(`REST API funcionando en el puerto ${port}`));
});
