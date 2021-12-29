using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace WebAPI1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatrixPatternController : ControllerBase
    {

        [HttpGet]
        public ActionResult GetAllPatterns()
        {
            var patterns = Util.LoadPatterns();
            return patterns.Count > 0 ? Ok(patterns) : NotFound();
        }

        [HttpPost]
        public ActionResult CreatePatterns(List<MatrixPattern> patterns)
        {
            try
            {
                ParsePatterns(patterns);
                return CreatedAtAction(nameof(GetAllPatterns), "Pattern(s) saved!");
            }
            catch (InvalidDataException e)
            {
                string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                if (env != null && env.Equals("Development"))
                {
                    Console.Error.WriteLine(e.Message);
                }
                return BadRequest("Pattern(s) must not be empty!");
            }
            catch (IOException)
            {
                return Problem("Error parsing patterns!", null, StatusCodes.Status500InternalServerError);
            }

        }

        protected bool ValidatePattern(MatrixPattern mp)
        {
            return mp.NumRows > 0 && mp.NumColumns > 0;
        }
        protected void ParsePatterns(List<MatrixPattern> patternList)
        {
            patternList.ForEach(pattern =>
            {
                try
                {
                    if (!ValidatePattern(pattern))
                    {
                        throw new InvalidDataException();
                    }
                    Util.SavePattern(pattern);
                }
                catch (IOException e)
                {
                    throw e;
                }
            });
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