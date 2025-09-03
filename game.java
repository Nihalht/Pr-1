import java.util.*;

public class game{
	public static void main(String[] args)
	{
		Scanner scan = new Scanner(System.in);
		int n = 5;

		for (int i=1 ; i<=n ; i++){
			for(int j=1 ; j<=n/j ; j++)
			{
				System.out.print("* ");
			}
			System.out.println();
		}
	}
}

			// 		j
			// i    *
			// 	   * *
			// 	  * * * 
			// 	 * * * * 
			// 	* * * * * 