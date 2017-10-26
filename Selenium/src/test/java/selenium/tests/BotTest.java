package selenium.tests;

import static org.junit.Assert.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;

public class BotTest
{
	private static WebDriver driver;
	private static WebDriverWait wait;
	
	@BeforeClass
	public static void setUp() throws Exception 
	{
		//driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
		initPage();
	}
	
	public static void initPage()
	{
		driver.get("https://csc510-projectgroup.slack.com/");

		// Wait until page loads and we can see a sign in button.
		wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Enter our email and password
		// If running this from Eclipse, you should specify these variables in the run configurations.
		email.sendKeys(System.getenv("SLACK_EMAIL"));
		pw.sendKeys(System.getenv("SLACK_PASSWORD"));

		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();

		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));

		// Switch to #SciBot channel and wait for it to load.
		driver.get("https://csc510-projectgroup.slack.com/messages/SciBot");
		wait.until(ExpectedConditions.titleContains("SciBot"));

		
	}
	
	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}
	
	@Test
	public void signin() {
		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("Signing in");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'Signing in']"));
		assertNotNull(msg);
		WebElement checkMessage = driver.findElement(By.xpath("//span[@class='message_body' and text() = 'Signing in']/../../following-sibling::ts-message/div/span[@class='message_body']"));
		assertEquals(checkMessage.getText(), "Have you updated your daily status?");
		wait.withTimeout(10, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
	}
	
	@Test
	public void yesUpdated() {
		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("yes updated");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'yes updated']"));
		assertNotNull(msg);
		WebElement checkMessage = driver.findElement(By.xpath("//span[@class='message_body' and text() = 'yes updated']/../../following-sibling::ts-message/div/span[@class='message_body']"));
		assertEquals(checkMessage.getText(), "Okay, thank you! You may sign off.");
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
	}
	
	@Test
	public void noNotUpdated() {
		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("Signing In\n");
		driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
		actions.sendKeys("no not updated");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(5, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'no not updated']"));
		assertNotNull(msg);
		WebElement checkMessage = driver.findElement(By.xpath("//span[@class='message_body' and text() = 'no not updated']/../../following-sibling::ts-message/div/span[@class='message_body']"));
		assertEquals(checkMessage.getText(), "Please update your daily status.\n1. What did you do yesterday?\n2. What will you do today?\n3. What obstacles came in your way?");
	}
	
	@Test
	public void noIwasOff_AlternateFlow() {
		// Type something
		wait.withTimeout(50, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("Signing In\n");
		driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
		actions.sendKeys("no I was off yesterday");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[@class='message_body' and text() = 'no I was off yesterday']")));

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'no I was off yesterday']"));
		assertNotNull(msg);
		WebElement checkMessage = driver.findElement(By.xpath("//span[@class='message_body' and text() = 'no I was off yesterday']/../../following-sibling::ts-message/div/span[@class='message_body']"));
		assertEquals(checkMessage.getText(), "Please update your daily status.\nWhat will you do today?");
	}
	/*
	@Test
	public void addStatus() {
		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("here's my daily status" + 
				"1. yesterday: i completed the issue on replicating production servers" + 
				"2. today: i am planning to look into the feature documentation" + 
				"3. obstacles: not all requirements are in place");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[@class='message_body' and text() = 'here's my daily status" + 
        		"1. yesterday: i completed the issue on replicating production servers" + 
        		"2. today: i am planning to look into the feature documentation" + 
        		"3. obstacles: not all requirements are in place']")));

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'no I was off yesterday']"));
		assertNotNull(msg);
		WebElement checkMessage = driver.findElement(By.xpath("//span[@class='message_body' and text() = 'here's my daily status" + 
				"1. yesterday: i completed the issue on replicating production servers" + 
				"2. today: i am planning to look into the feature documentation" + 
				"3. obstacles: not all requirements are in place']/../../following-sibling::ts-message/div/span[@class='message_body']"));
		assertEquals(checkMessage.getText(), "Your daily status has been saved!");
	}
	*/
	
	@Test
	public void generateSummaryReport() {
		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("report generated for previous sprint?");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(5, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'report generated for previous sprint?']"));
		assertNotNull(msg);
		WebElement checkMessage = driver.findElement(By.xpath("//span[@class='message_body' and text() = 'report generated for previous sprint?']/../../following-sibling::ts-message/div/span[@class='message_body']"));
		assertEquals(checkMessage.getText(), "The generated report is available at https://github.ncsu.edu/nkumar8/CSC510_F17_Project/blob/master/DESIGN.md\nGitHub\nBuild software better, together\nGitHub is where people build software. More than 15 million people use GitHub to discover, fork, and contribute to over 38 million projects. (9kB)");
	}

	
	@Test
	public void generateSummaryReport_alternate() {
		// Type something
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("report generated for current sprint?");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(5, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'report generated for current sprint?']"));
		assertNotNull(msg);
		WebElement checkMessage = driver.findElement(By.xpath("//span[@class='message_body' and text() = 'report generated for current sprint?']/../../following-sibling::ts-message/div/span[@class='message_body']"));
		assertEquals(checkMessage.getText(), "The report for the given sprint cannot be generated at the moment as users have not updated their work yet.");
	}
	
	@Test
	public void createPingRequest() {
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("ping user stiruma at 1pm everyday for status");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
		List<WebElement> msgs = driver.findElements(
				By.xpath("//span[@class='message_body' and text() = 'ping user stiruma at 1pm everyday for status']"));
		WebElement last_msg = msgs.get(msgs.size()-1);
		assertNotNull(last_msg);
		WebElement checkMessage = last_msg.findElement(By.xpath("../../following-sibling::ts-message//span[@class='message_body']"));
		assertEquals(checkMessage.getText(), "your ping is generated for the user :stiruma in category: status");
	}
	
	@Test
	public void createPingRequest_alternate() {
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("ping user stiruma at 1pm everyday for status");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
		List<WebElement> msgs = driver.findElements(
				By.xpath("//span[@class='message_body' and text() = 'ping user stiruma at 1pm everyday for status']"));
		WebElement last_msg = msgs.get(msgs.size()-1);
		assertNotNull(last_msg);
		WebElement checkMessage = last_msg.findElement(By.xpath("../../following-sibling::ts-message//span[@class='message_body']"));
		assertEquals(checkMessage.getText(), "Not authorised to configure pings");
	}
	
}
