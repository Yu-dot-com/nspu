import supabase from "./supabase_client"

export async function logout(){
    const {error} = await supabase.auth.signOut()
    if (error) {
    console.error("Error logging out:", error.message);
    alert("Logout failed, please try again.");
  }
}