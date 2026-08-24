import React from 'react';

export default function AttendanceLogUI() {
    return (
        <div className="w-full">
            {/* Page Canvas */}
            <div className="flex-grow w-full">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-4">
                        <div>
                            <h1 className="text-headline-lg font-headline-lg text-on-surface mb-xs">Attendance Log</h1>
                            <p className="text-body-md font-body-md text-on-surface-variant">Engineering Department • Detailed View</p>
                        </div>
                        <div className="flex flex-wrap gap-md items-center">
                            {/* Date Picker Mockup */}
                            <div className="flex items-center bg-surface border border-outline-variant/50 rounded-DEFAULT overflow-hidden focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20 transition-all">
                                <button className="px-3 py-2 border-r border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                </button>
                                <div className="px-md py-2 flex items-center gap-sm cursor-pointer hover:bg-surface-container-low transition-colors">
                                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calendar_today</span>
                                    <span className="text-tabular-nums font-tabular-nums text-on-surface whitespace-nowrap">Oct 12 - Oct 18, 2023</span>
                                </div>
                                <button className="px-3 py-2 border-l border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </button>
                            </div>
                            <button className="bg-surface border border-outline-variant/50 text-on-surface px-md py-sm rounded-DEFAULT flex items-center gap-sm hover:bg-surface-container-low transition-colors text-label-md font-label-md shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                Filter
                            </button>
                            <button className="bg-primary-container text-on-primary-container px-md py-sm rounded-DEFAULT flex items-center gap-sm hover:bg-primary-container/90 transition-colors text-label-md font-label-md shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Export
                            </button>
                        </div>
                    </div>
                    {/* KPI Cards Bento Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
                        <div className="bg-surface border border-outline-variant/30 rounded-DEFAULT p-md flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-sm">
                                <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Total Present</span>
                                <span className="material-symbols-outlined text-primary text-xl">group</span>
                            </div>
                            <div className="text-display-lg font-display-lg text-on-surface">142</div>
                            <div className="text-body-sm font-body-sm text-green-700 bg-green-50 px-2 py-0.5 rounded inline-flex items-center w-fit mt-xs">
                                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
                                +2% vs last week
                            </div>
                        </div>
                        <div className="bg-surface border border-outline-variant/30 rounded-DEFAULT p-md flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-sm">
                                <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Absent</span>
                                <span className="material-symbols-outlined text-error text-xl">event_busy</span>
                            </div>
                            <div className="text-display-lg font-display-lg text-on-surface">4</div>
                            <div className="text-body-sm font-body-sm text-on-surface-variant mt-xs">
                                3 excused, 1 unexcused
                            </div>
                        </div>
                        <div className="bg-surface border border-outline-variant/30 rounded-DEFAULT p-md flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-sm">
                                <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Late Arrivals</span>
                                <span className="material-symbols-outlined text-tertiary text-xl">timer</span>
                            </div>
                            <div className="text-display-lg font-display-lg text-on-surface">12</div>
                            <div className="text-body-sm font-body-sm text-error bg-error-container/50 px-2 py-0.5 rounded inline-flex items-center w-fit mt-xs">
                                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
                                +5% vs last week
                            </div>
                        </div>
                        <div className="bg-surface border border-outline-variant/30 rounded-DEFAULT p-md flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-sm">
                                <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Avg Hrs/Day</span>
                                <span className="material-symbols-outlined text-secondary text-xl">hourglass_empty</span>
                            </div>
                            <div className="text-display-lg font-display-lg text-on-surface">8.2</div>
                            <div className="text-body-sm font-body-sm text-on-surface-variant mt-xs">
                                Target: 8.0 hrs
                            </div>
                        </div>
                    </div>
                    {/* Data Table Container */}
                    <div className="bg-surface border border-outline-variant/30 rounded-DEFAULT overflow-hidden shadow-sm flex flex-col">
                        {/* Table Toolbar */}
                        <div className="px-md py-sm border-b border-outline-variant/30 bg-surface-container-lowest flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-headline-md font-headline-md text-on-surface">Daily Records</h2>
                            <div className="flex gap-sm w-full sm:w-auto">
                                <div className="relative w-full sm:w-auto">
                                    <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                                    <input className="w-full sm:w-64 bg-surface-container-high border-none rounded-DEFAULT pl-8 pr-3 py-1.5 text-body-sm font-body-sm text-on-surface focus:ring-1 focus:ring-primary-container transition-all" placeholder="Search employee..." type="text" />
                                </div>
                            </div>
                        </div>
                        {/* The Table */}
                        <div className="overflow-x-auto w-full">
                            <table className="w-full min-w-[800px] text-left border-collapse">
                                <thead className="bg-surface-container-low border-b border-outline-variant/30">
                                    <tr>
                                        <th className="px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider font-semibold w-1/4">Employee</th>
                                        <th className="px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Date</th>
                                        <th className="px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Status</th>
                                        <th className="px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-right">Clock In</th>
                                        <th className="px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-right">Clock Out</th>
                                        <th className="px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-right">Break</th>
                                        <th className="px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-right">Total Hrs</th>
                                        <th className="px-sm py-sm w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-body-sm font-body-sm text-on-surface divide-y divide-outline-variant/20">
                                    {/* Row 1 (Present) */}
                                    <tr className="hover:bg-surface-container-lowest transition-colors h-[48px] group">
                                        <td className="px-md py-sm">
                                            <div className="flex items-center gap-sm">
                                                <div className="h-8 w-8 rounded-full bg-surface-dim overflow-hidden flex-shrink-0">
                                                    <img alt="Sarah Jenkins" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWmGWRruSmGvTRHJYGPKktAawMVaxUuBEJ_5Jds1tyZjW7tHbVY6QyyzWreOaUr-6lokeKzXkD2mqHxtinAEo4MwC-7o65VyUUIUgkopKrhkr9qOcEj1WWj3ctMBxHo4j8-64fbc7ueTSTZL1W91a36gO0pxVsF0HNYci7ZAOpPpB5wf6OygK541hYOjiRG3WY3okzDJSbyYE15shoB4TGEzC554CyDrtEfD7711c8c5AHVmoklkGHWw" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">Sarah Jenkins</div>
                                                    <div className="text-on-surface-variant text-[11px]">ENG-0142</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-md py-sm font-tabular-nums">Oct 18, 2023</td>
                                        <td className="px-md py-sm">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                                                Present
                                            </span>
                                        </td>
                                        <td className="px-md py-sm font-tabular-nums text-right">08:55 AM</td>
                                        <td className="px-md py-sm font-tabular-nums text-right">05:05 PM</td>
                                        <td className="px-md py-sm font-tabular-nums text-right text-on-surface-variant">45m</td>
                                        <td className="px-md py-sm font-tabular-nums text-right font-medium">7h 25m</td>
                                        <td className="px-sm py-sm text-center">
                                            <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary-container">
                                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Row 2 (Late) */}
                                    <tr className="hover:bg-surface-container-lowest transition-colors h-[48px] group">
                                        <td className="px-md py-sm">
                                            <div className="flex items-center gap-sm">
                                                <div className="h-8 w-8 rounded-full bg-surface-dim overflow-hidden flex-shrink-0">
                                                    <img alt="Michael Chen" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvFUbZMvQuodmrcBAKpGp80L7N1js6ABqcS449wkozi0zWr39aodtc_D8SMqssBThAPrxHCObgPBP5uZBYr0xbLcH3zNPlLDZ6OXcUcotQsA5G7_Y2_DyL2m9Sk3U_t0AgIHqIv7EMvKjbmAdEMlg9yBJ9QWN9UYKcRUScPKOrKwzUoa4g_87UTJO3em2xWz8LMn8UPn458aNlXBjyrPeiuezP5O-XMuV2LOPP_4NgfRvRG0-znjtCmw" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">Michael Chen</div>
                                                    <div className="text-on-surface-variant text-[11px]">ENG-0188</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-md py-sm font-tabular-nums">Oct 18, 2023</td>
                                        <td className="px-md py-sm">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200">
                                                Late
                                            </span>
                                        </td>
                                        <td className="px-md py-sm font-tabular-nums text-right text-orange-700 font-medium">09:30 AM</td>
                                        <td className="px-md py-sm font-tabular-nums text-right">06:15 PM</td>
                                        <td className="px-md py-sm font-tabular-nums text-right text-on-surface-variant">1h 00m</td>
                                        <td className="px-md py-sm font-tabular-nums text-right font-medium">7h 45m</td>
                                        <td className="px-sm py-sm text-center">
                                            <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary-container">
                                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Row 3 (Absent) */}
                                    <tr className="hover:bg-surface-container-lowest transition-colors h-[48px] group bg-surface-container-highest/20">
                                        <td className="px-md py-sm">
                                            <div className="flex items-center gap-sm">
                                                <div className="h-8 w-8 rounded-full bg-surface-dim overflow-hidden flex-shrink-0 flex items-center justify-center text-primary-container font-bold text-xs">
                                                    AJ
                                                </div>
                                                <div>
                                                    <div className="font-medium">Amanda Jones</div>
                                                    <div className="text-on-surface-variant text-[11px]">ENG-0201</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-md py-sm font-tabular-nums">Oct 18, 2023</td>
                                        <td className="px-md py-sm">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-error-container/30 text-error border border-error/20">
                                                Absent
                                            </span>
                                        </td>
                                        <td className="px-md py-sm font-tabular-nums text-right text-on-surface-variant italic">--:--</td>
                                        <td className="px-md py-sm font-tabular-nums text-right text-on-surface-variant italic">--:--</td>
                                        <td className="px-md py-sm font-tabular-nums text-right text-on-surface-variant italic">--</td>
                                        <td className="px-md py-sm font-tabular-nums text-right font-medium text-error">0h 00m</td>
                                        <td className="px-sm py-sm text-center">
                                            <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary-container">
                                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Row 4 (On Leave) */}
                                    <tr className="hover:bg-surface-container-lowest transition-colors h-[48px] group">
                                        <td className="px-md py-sm">
                                            <div className="flex items-center gap-sm">
                                                <div className="h-8 w-8 rounded-full bg-surface-dim overflow-hidden flex-shrink-0">
                                                    <img alt="David Kim" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNycM3hUYv-W7-HRm996opKWJ8XQ5Q_nFHaIQt3IgfNDTO0kPF4Td2DSDNLLmoUYdnI2cvyz_HI_78ToSozVmjp-eb_gnYaxzbevZ-LQOcqc95n0fwVu1niOyHnVF5Da2EYpem-yPQYUhI_WZN6CygneRoyw-580AIUJYRswlTjfGn5SNu98F9EpbTiR7PBl6miIllexmShhvYwud_8JNB0hkolbFx3lz-CBFTZo8m50_C5CAiT57rvg" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">David Kim</div>
                                                    <div className="text-on-surface-variant text-[11px]">ENG-0092</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-md py-sm font-tabular-nums">Oct 18, 2023</td>
                                        <td className="px-md py-sm">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                On Leave (PTO)
                                            </span>
                                        </td>
                                        <td className="px-md py-sm font-tabular-nums text-right text-on-surface-variant italic">--:--</td>
                                        <td className="px-md py-sm font-tabular-nums text-right text-on-surface-variant italic">--:--</td>
                                        <td className="px-md py-sm font-tabular-nums text-right text-on-surface-variant italic">--</td>
                                        <td className="px-md py-sm font-tabular-nums text-right font-medium">8h 00m (Credited)</td>
                                        <td className="px-sm py-sm text-center">
                                            <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary-container">
                                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Footer */}
                        <div className="px-md py-sm border-t border-outline-variant/30 bg-surface-container-lowest flex flex-col sm:flex-row justify-between items-center gap-4 text-body-sm font-body-sm text-on-surface-variant">
                            <div>Showing 1 to 4 of 142 entries</div>
                            <div className="flex items-center gap-xs flex-wrap justify-center">
                                <button className="p-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled>
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                </button>
                                <button className="w-8 h-8 rounded-DEFAULT bg-primary-container text-on-primary-container font-medium flex items-center justify-center">1</button>
                                <button className="w-8 h-8 rounded-DEFAULT hover:bg-surface-container-high transition-colors flex items-center justify-center">2</button>
                                <button className="w-8 h-8 rounded-DEFAULT hover:bg-surface-container-high transition-colors flex items-center justify-center">3</button>
                                <span className="px-1">...</span>
                                <button className="w-8 h-8 rounded-DEFAULT hover:bg-surface-container-high transition-colors flex items-center justify-center">15</button>
                                <button className="p-1 rounded hover:bg-surface-container-high transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
