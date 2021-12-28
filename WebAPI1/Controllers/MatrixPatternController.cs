using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace WebAPI1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MatrixPatternController : ControllerBase
    {
        [HttpPost]
        public HttpResponseMessage Post(MatrixPattern incomingPattern)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            if (ValidateResponseBody(incomingPattern))
            {
                Util.SavePattern(incomingPattern);
                if (Util.PatternExist())
                {
                    response.StatusCode = System.Net.HttpStatusCode.OK;
                    response.ReasonPhrase = "Pattern successfully saved!";
                }
                else
                {
                    response.StatusCode=System.Net.HttpStatusCode.BadRequest;
                    response.ReasonPhrase = "Error saving pattern!";
                }
            }
            else
            {
                response.StatusCode = System.Net.HttpStatusCode.BadRequest;
                response.ReasonPhrase = "pattern must not be empty";
            }
            return response;
        }

        public static bool ValidateResponseBody(MatrixPattern mp)
        {
            return mp.NumRows > 0 && mp.NumColumns > 0;
        }
    }

    class Util
    {
        private static readonly string Path = "./pattern.txt";
        public static void SavePattern(MatrixPattern mp)
        {
            string patternDimensions = mp.NumRows + "," + mp.NumColumns;
            StringBuilder buffer = new StringBuilder(patternDimensions).AppendLine();
            mp.Pattern.ForEach(row =>
            {
                row.ForEach(col =>
                {
                    buffer.Append(col + " ");
                });
                buffer.AppendLine();
            });

            
            FileStream fs = new FileStream(Path, FileMode.Create);
            fs.Write(new UTF8Encoding(true).GetBytes(buffer.ToString()), 0, buffer.Length);
            fs.Close();
        }

        public static bool PatternExist() => File.Exists(Path);
    }
}