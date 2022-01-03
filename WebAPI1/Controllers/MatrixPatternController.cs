using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatrixPatternController : ControllerBase
    {

        [HttpGet]
        public ActionResult GetAllPatterns()
        {
		Util.ExecPatternScript();
            var patterns = Util.LoadPatterns();
            if(patterns.Count == 0) return NotFound();
            return Ok(patterns); 
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
        private static readonly string Path = "../../pattern.txt";

        public static List<MatrixPattern> LoadPatterns()
        {
            IEnumerable<string> p = File.ReadLines(Path, Encoding.UTF8);
            List<MatrixPattern> patterns = new List<MatrixPattern>();
            MatrixPattern mp = new MatrixPattern();
            int rowcount = 0;

            foreach (string pattern in p)
            {

		if (pattern.Contains('\r'))
                {
                    pattern.Replace("\r", "");
                }
                if (pattern.Contains(','))
                {
                    rowcount = 0;
                    mp.NumRows = (int)char.GetNumericValue(pattern.ElementAt(0));
                    mp.NumColumns = (int)char.GetNumericValue(pattern.ElementAt(2));
                }
                else
                {
                    if (rowcount++ != mp.NumRows)
                    {
			mp.Pattern.Add(pattern.Replace(@" ", @"")
                                        .ToCharArray().ToList()
                                        .ConvertAll(i => (int)char.GetNumericValue(i)));
                    }
                    else
                    {
                        patterns.Add(mp);
                        mp = new MatrixPattern();
                    }
                }
            }
            return patterns;
        }

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

            try
            {
                File.AppendAllText(Path, buffer.AppendLine().ToString(), Encoding.UTF8);
            }
            catch (IOException e)
            {
                throw e;
            }
        }


     public static void ExecPatternScript()
     {
          ProcessStartInfo processStartInfo = new ProcessStartInfo();
            processStartInfo.FileName = "/usr/bin/bash";
            processStartInfo.Arguments = " -c  \"make -C {Path}\" ";
            processStartInfo.UseShellExecute = false; //don't run in command prompt
            processStartInfo.RedirectStandardOutput = true; //redirect from cmd to stdout
            processStartInfo.RedirectStandardError = true; //redirect from cmd to stderr
            processStartInfo.CreateNoWindow = true; //don't create new window for process

            Process p = new Process { StartInfo = processStartInfo };
            p.Start();

            string error = p.StandardError.ReadToEnd();
            if (!string.IsNullOrEmpty(error)) Console.WriteLine(error);

            p.WaitForExit();
	    Console.WriteLine(p.StandardOutput.ReadToEnd());
     }
    }
}
