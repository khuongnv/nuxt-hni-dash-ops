export default defineEventHandler(async (event) => {
  try {
    const { execSync } = await import('child_process')
    
    // Get git log with detailed information
    const gitLog = execSync('git log --oneline --graph --decorate --all -20', { 
      encoding: 'utf8',
      cwd: process.cwd()
    })
    
    // Get git log with more details for each commit
    const detailedLog = execSync('git log --pretty=format:"%h|%an|%ae|%ad|%s" --date=iso -20', { 
      encoding: 'utf8',
      cwd: process.cwd()
    })
    
    // Parse detailed log
    const commits = detailedLog.split('\n').map(line => {
      const [hash, author, email, date, message] = line.split('|')
      return {
        hash: hash?.trim(),
        author: author?.trim(),
        email: email?.trim(),
        date: date?.trim(),
        message: message?.trim()
      }
    }).filter(commit => commit.hash)
    
    // Get current branch
    const currentBranch = execSync('git branch --show-current', { 
      encoding: 'utf8',
      cwd: process.cwd()
    }).trim()
    
    // Get remote branches
    const remoteBranches = execSync('git branch -r', { 
      encoding: 'utf8',
      cwd: process.cwd()
    }).split('\n').map(branch => branch.trim()).filter(branch => branch)
    
    // Get last push info
    let lastPush = null
    try {
      const lastPushInfo = execSync('git log origin/main..HEAD --oneline', { 
        encoding: 'utf8',
        cwd: process.cwd()
      })
      if (lastPushInfo.trim()) {
        lastPush = {
          unpushed: lastPushInfo.split('\n').filter(line => line.trim()).length,
          commits: lastPushInfo.split('\n').filter(line => line.trim())
        }
      }
    } catch (error) {
      // No unpushed commits
    }
    
    return {
      success: true,
      data: {
        currentBranch,
        remoteBranches,
        commits,
        lastPush,
        rawLog: gitLog
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Git log error: ${error.message}`
    })
  }
})
