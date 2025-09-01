import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Nav from "../components/Nav";
import { useUser } from "../hooks/useUser";
import supabase from "../database/supabase_client";

const Main = () => {
  const { data: currentUser, error: currentUsererror, isLoading } = useUser();
  const [remainder, setRemainder] = useState<any>([]);

  useEffect(() => {
    if (currentUsererror) alert(currentUsererror.message ?? currentUsererror);
  }, [currentUsererror]);

  useEffect(() => {
    if (!isLoading && currentUser) {
      const run = async () => {
        const remainderList = await fetchReminders();
        await checkNotification(remainderList);
      };

      const fetchReminders = async () => {
        const { data: data_reminder, error } = await supabase
          .from("notifications")
          .select(`id,one_day,two_day,three_day,four_day,five_day,files(duedate,name,id)`)
          .eq("user_id", currentUser.id);
        if (error) {
          console.log("Error fetching remainder", error);
          return [];
        }
        setRemainder(data_reminder || []);
        return data_reminder || [];
      };

      const checkNotification = async (remainderList: any[]) => {
        const now = Date.now();
        for (const remainder of remainderList) {
          const file = remainder.files;
          if (!file.duedate) continue;
          const deadlineStr = file.duedate;
          const deadlineLocal = deadlineStr.split("+")[0];
          const deadlineDate = new Date(deadlineLocal);
          const now = new Date();
          const hourLeft =
            (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
          console.log("hourleft", hourLeft);

          if (hourLeft > 0) {
            if (hourLeft <= 24 && !remainder.one_day) {
              if (window.electronAPI?.notify) {
                await window.electronAPI.notify({
                  title: "1 day left",
                  body: `${file.name} is about to due in less than 1 day`
                });
              }
              const {error}=await supabase
                .from("notifications")
                .update({ one_day: true })
                .eq("id", remainder.id);
                if(error){
                  alert("hiiiiii")
                  console.log("error",error)
                }
              const {error:history_error} = await supabase.from("notification_history").insert({
                user_id: currentUser.id,
                file_id: file.id,
                title: `${file.name} (1 day left)`,
                body: `${file.name} is about to due in less than 1 day`
              })
              if(history_error){
                console.log("Fialed to add history")
              }
            }
            else if(hourLeft <= 48 && !remainder.two_day && !remainder.one_day ){
              if (window.electronAPI?.notify) {
                await window.electronAPI.notify({
                  title: "2 days left",
                  body: `${file.name}will be due in 2 days`
                });
              }
              await supabase
                .from("notifications")
                .update({ two_day: true })
                .eq("id", remainder.id);
              const {error:history_error} = await supabase.from("notification_history").insert({
                user_id: currentUser.id,
                file_id: file.id,
                title: `${file.name} (2 days left)`,
                body: `${file.name} is about to due in less than 2 days`
              })
              if(history_error){
                console.log("Fialed to add history")
              }
            }
            else if(hourLeft<= 72 && !remainder.three_day && !remainder.two_day && !remainder.one_day ){
              if (window.electronAPI?.notify) {
                await window.electronAPI.notify({
                  title: "3 days left",
                  body: `${file.name}will be due in 3 days`
                });
              }
              await supabase
                .from("notifications")
                .update({ three_day: true })
                .eq("id", remainder.id);
              const {error:history_error} = await supabase.from("notification_history").insert({
                user_id: currentUser.id,
                file_id: file.id,
                title: `${file.name} (3 days left)`,
                body: `${file.name} is about to due in less than 3 days`
              })
              if(history_error){
                console.log("Fialed to add history")
              }
            }
            else if(hourLeft<= 96 && !remainder.four_day && !remainder.three_day && !remainder.two_day && !remainder.one_day){
              if (window.electronAPI?.notify) {
                await window.electronAPI.notify({
                  title: "4 days left",
                  body: `${file.name}will be due in 4 days`
                });
              }
              await supabase
                .from("notifications")
                .update({ four_day: true })
                .eq("id", remainder.id);
              const {error:history_error} = await supabase.from("notification_history").insert({
                user_id: currentUser.id,
                file_id: file.id,
                title: `${file.name} (4 days left)`,
                body: `${file.name} is about to due in less than 4 days`
              })
              if(history_error){
                console.log("Fialed to add history")
              }
            }
            else if(hourLeft<= 120 && !remainder.five_day && !remainder.four_day && !remainder.three_day && !remainder.two_day && !remainder.one_day){
              if (window.electronAPI?.notify) {
                await window.electronAPI.notify({
                  title: "5 days left",
                  body: `${file.name}will be due in 5 days`
                });
              }
              await supabase
                .from("notifications")
                .update({ five_day: true })
                .eq("id", remainder.id);
              const {error:history_error} = await supabase.from("notification_history").insert({
                user_id: currentUser.id,
                file_id: file.id,
                title:`${file.name} (5 days left)`,
                body: `${file.name} is about to due in less than 5 days`
              })
              if(history_error){
                console.log("Fialed to add history")
              }
            }
          }else if(remainder.one_day === true){
            const {error: deleteError} = await supabase.from("notifications").delete().eq("id",remainder.id)
            if(deleteError){
              alert(deleteError);
              console.log("deleteerror",deleteError)
            }
          }
        }
      };
      run();
      const fetchInterval = setInterval(run,1000*30);
      return () => clearInterval(fetchInterval)
    }
  }, [isLoading,currentUser]);

    useEffect(() => {
    // console.log("reminders updated:", remainder);
  }, [remainder]);

  return (
    <div id="root" className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 bg-bg-color overflow-auto p-4">
        <Nav />
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
