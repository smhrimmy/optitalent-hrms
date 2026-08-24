import React from 'react';

export default function AttendanceLogUI() {
    // Sample Data (24/7 Ops inclusive)
    const records = [
        { id: 1, name: 'Sarah Jenkins', code: 'ENG-0142', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWmGWRruSmGvTRHJYGPKktAawMVaxUuBEJ_5Jds1tyZjW7tHbVY6QyyzWreOaUr-6lokeKzXkD2mqHxtinAEo4MwC-7o65VyUUIUgkopKrhkr9qOcEj1WWj3ctMBxHo4j8-64fbc7ueTSTZL1W91a36gO0pxVsF0HNYci7ZAOpPpB5wf6OygK541hYOjiRG3WY3okzDJSbyYE15shoB4TGEzC554CyDrtEfD7711c8c5AHVmoklkGHWw', date: 'Oct 18, 2023', status: 'Present', clockIn: '08:55 AM', clockOut: '05:05 PM', breakTime: '45m', totalHrs: '7h 25m', type: 'present', statusColor: 'bg-green-50 text-green-700 border-green-200' },
        { id: 2, name: 'Michael Chen', code: 'ENG-0188', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvFUbZMvQuodmrcBAKpGp80L7N1js6ABqcS449wkozi0zWr39aodtc_D8SMqssBThAPrxHCObgPBP5uZBYr0xbLcH3zNPlLDZ6OXcUcotQsA5G7_Y2_DyL2m9Sk3U_t0AgIHqIv7EMvKjbmAdEMlg9yBJ9QWN9UYKcRUScPKOrKwzUoa4g_87UTJO3em2xWz8LMn8UPn458aNlXBjyrPeiuezP5O-XMuV2LOPP_4NgfRvRG0-znjtCmw', date: 'Oct 18, 2023', status: 'Late', clockIn: '09:30 AM', clockOut: '06:15 PM', breakTime: '1h 00m', totalHrs: '7h 45m', type: 'late', statusColor: 'bg-orange-50 text-orange-700 border-orange-200', inColor: 'text-orange-700 font-medium' },
        { id: 3, name: 'Amanda Jones', code: 'ENG-0201', initials: 'AJ', date: 'Oct 18, 2023', status: 'Absent', clockIn: '--:--', clockOut: '--:--', breakTime: '--', totalHrs: '0h 00m', type: 'absent', statusColor: 'bg-error-container/30 text-error border-error/20', outColor: 'text-error' },
        { id: 4, name: 'David Kim', code: 'ENG-0092', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNycM3hUYv-W7-HRm996opKWJ8XQ5Q_nFHaIQt3IgfNDTO0kPF4Td2DSDNLLmoUYdnI2cvyz_HI_78ToSozVmjp-eb_gnYaxzbevZ-LQOcqc95n0fwVu1niOyHnVF5Da2EYpem-yPQYUhI_WZN6CygneRoyw-580AIUJYRswlTjfGn5SNu98F9EpbTiR7PBl6miIllexmShhvYwud_8JNB0hkolbFx3lz-CBFTZo8m50_C5CAiT57rvg', date: 'Oct 18, 2023', status: 'On Leave', clockIn: '--:--', clockOut: '--:--', breakTime: '--', totalHrs: '8h 00m (Cred)', type: 'leave', statusColor: 'bg-blue-50 text-blue-700 border-blue-200' },
        { id: 5, name: 'Marcus Cole', code: 'ENG-0331', initials: 'MC', date: 'Oct 18, 2023', status: 'Overnight', clockIn: '10:00 PM', clockOut: '06:00 AM', breakTime: '30m', totalHrs: '7h 30m', type: 'present', statusColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    ];

    return (
        <div className="w-full">
            <div className="flex-grow w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-4">
                    <div className="w-full md:w-auto">
                        <h1 className="text-headline-sm md:text-headline-lg font-headline-sm md:font-headline-lg text-on-surface mb-xs">Attendance Log</h1>
                        <p className="text-body-sm md:text-body-md text-on-surface-variant">Engineering Department • Detailed View</p>
                    </div>
                    
                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
                        <div className="flex items-center bg-surface border border-outline-variant/50 rounded-DEFAULT overflow-hidden focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20 transition-all min-h-[44px]">
                            <button className="px-3 py-2 border-r border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]">
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            <div className="px-md py-2 flex items-center justify-center gap-sm flex-1 cursor-pointer hover:bg-surface-container-low transition-colors min-h-[44px]">
                                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calendar_today</span>
                                <span className="text-tabular-nums font-tabular-nums text-on-surface text-body-sm font-medium whitespace-nowrap">Oct 12 - 18, 2023</span>
                            </div>
                            <button className="px-3 py-2 border-l border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]">
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 sm:flex-none bg-surface border border-outline-variant/50 text-on-surface px-md py-sm min-h-[44px] rounded-DEFAULT flex items-center justify-center gap-sm hover:bg-surface-container-low transition-colors text-label-md font-label-md shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                Filter
                            </button>
                            <button className="flex-1 sm:flex-none bg-primary-container text-on-primary-container px-md py-sm min-h-[44px] rounded-DEFAULT flex items-center justify-center gap-sm hover:bg-primary-container/90 transition-colors text-label-md font-label-md shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Cards: Compact on Mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-md mb-lg">
                    <div className="bg-surface border border-outline-variant/30 rounded-DEFAULT p-3 md:p-md flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-1 md:mb-sm">
                            <span className="text-[10px] md:text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Present</span>
                            <span className="material-symbols-outlined text-primary text-sm md:text-xl">group</span>
                        </div>
                        <div className="text-headline-md md:text-display-lg font-tabular-nums text-on-surface">142</div>
                        <div className="text-[10px] md:text-body-sm text-green-700 bg-green-50 px-1.5 py-0.5 rounded inline-flex items-center w-fit mt-1 md:mt-xs">
                            <span className="material-symbols-outlined text-[12px] md:text-[14px] mr-1">trending_up</span>
                            +2%
                        </div>
                    </div>
                    <div className="bg-surface border border-outline-variant/30 rounded-DEFAULT p-3 md:p-md flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-1 md:mb-sm">
                            <span className="text-[10px] md:text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Absent</span>
                            <span className="material-symbols-outlined text-error text-sm md:text-xl">event_busy</span>
                        </div>
                        <div className="text-headline-md md:text-display-lg font-tabular-nums text-on-surface">4</div>
                        <div className="text-[10px] md:text-body-sm text-on-surface-variant mt-1 md:mt-xs">
                            3 excused
                        </div>
                    </div>
                    <div className="bg-surface border border-outline-variant/30 rounded-DEFAULT p-3 md:p-md flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-1 md:mb-sm">
                            <span className="text-[10px] md:text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Late</span>
                            <span className="material-symbols-outlined text-tertiary text-sm md:text-xl">timer</span>
                        </div>
                        <div className="text-headline-md md:text-display-lg font-tabular-nums text-on-surface">12</div>
                        <div className="text-[10px] md:text-body-sm text-error bg-error-container/50 px-1.5 py-0.5 rounded inline-flex items-center w-fit mt-1 md:mt-xs">
                            <span className="material-symbols-outlined text-[12px] md:text-[14px] mr-1">trending_up</span>
                            +5%
                        </div>
                    </div>
                    <div className="bg-surface border border-outline-variant/30 rounded-DEFAULT p-3 md:p-md flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-1 md:mb-sm">
                            <span className="text-[10px] md:text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Avg Hrs</span>
                            <span className="material-symbols-outlined text-secondary text-sm md:text-xl">hourglass_empty</span>
                        </div>
                        <div className="text-headline-md md:text-display-lg font-tabular-nums text-on-surface">8.2</div>
                        <div className="text-[10px] md:text-body-sm text-on-surface-variant mt-1 md:mt-xs">
                            Target: 8.0
                        </div>
                    </div>
                </div>

                {/* Data Container */}
                <div className="bg-surface border border-outline-variant/30 rounded-DEFAULT shadow-sm flex flex-col overflow-hidden">
                    {/* Toolbar */}
                    <div className="px-3 md:px-md py-3 md:py-sm border-b border-outline-variant/30 bg-surface-container-lowest flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h2 className="text-title-md md:text-headline-md font-headline-md text-on-surface">Daily Records</h2>
                        <div className="relative w-full sm:w-auto">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                            <input className="w-full sm:w-64 bg-surface-container-high border-none rounded-DEFAULT pl-9 pr-3 py-2 md:py-1.5 min-h-[44px] md:min-h-0 text-body-sm text-on-surface focus:ring-2 focus:ring-primary-container transition-all" placeholder="Search employee..." type="text" />
                        </div>
                    </div>

                    {/* DESKTOP TABLE */}
                    <div className="hidden md:block overflow-x-auto w-full">
                        <table className="w-full min-w-[800px] text-left border-collapse">
                            <thead className="bg-surface-container-low border-b border-outline-variant/30">
                                <tr>
                                    <th className="px-md py-sm text-label-md font-semibold text-on-surface-variant uppercase tracking-wider w-1/4">Employee</th>
                                    <th className="px-md py-sm text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">Date</th>
                                    <th className="px-md py-sm text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                                    <th className="px-md py-sm text-label-md font-semibold text-on-surface-variant uppercase tracking-wider text-right">Clock In</th>
                                    <th className="px-md py-sm text-label-md font-semibold text-on-surface-variant uppercase tracking-wider text-right">Clock Out</th>
                                    <th className="px-md py-sm text-label-md font-semibold text-on-surface-variant uppercase tracking-wider text-right">Total Hrs</th>
                                    <th className="px-sm py-sm w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="text-body-sm text-on-surface divide-y divide-outline-variant/20">
                                {records.map(rec => (
                                    <tr key={rec.id} className="hover:bg-surface-container-lowest transition-colors h-[48px] group">
                                        <td className="px-md py-sm">
                                            <div className="flex items-center gap-sm">
                                                <div className="h-8 w-8 rounded-full bg-surface-dim overflow-hidden flex-shrink-0 flex items-center justify-center text-primary-container font-bold text-xs">
                                                    {rec.avatar ? <img alt={rec.name} className="w-full h-full object-cover" src={rec.avatar} /> : rec.initials}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{rec.name}</div>
                                                    <div className="text-on-surface-variant text-[11px]">{rec.code}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-md py-sm font-tabular-nums">{rec.date}</td>
                                        <td className="px-md py-sm">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${rec.statusColor}`}>
                                                {rec.status}
                                            </span>
                                        </td>
                                        <td className={`px-md py-sm font-tabular-nums text-right ${rec.inColor || 'text-on-surface-variant'}`}>{rec.clockIn}</td>
                                        <td className="px-md py-sm font-tabular-nums text-right">{rec.clockOut}</td>
                                        <td className={`px-md py-sm font-tabular-nums text-right ${rec.outColor || 'font-medium'}`}>{rec.totalHrs}</td>
                                        <td className="px-sm py-sm text-center">
                                            <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary-container min-h-[44px] min-w-[44px] flex justify-center items-center">
                                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARDS */}
                    <div className="md:hidden flex flex-col divide-y divide-outline-variant/20">
                        {records.map(rec => (
                            <div key={rec.id} className="p-3 bg-surface hover:bg-surface-container-lowest transition-colors flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-surface-dim overflow-hidden flex-shrink-0 flex items-center justify-center text-primary-container font-bold text-sm">
                                            {rec.avatar ? <img alt={rec.name} className="w-full h-full object-cover" src={rec.avatar} /> : rec.initials}
                                        </div>
                                        <div>
                                            <div className="font-medium text-body-md text-on-surface">{rec.name}</div>
                                            <div className="text-on-surface-variant text-body-sm">{rec.code}</div>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${rec.statusColor}`}>
                                        {rec.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-2 bg-surface-container-lowest p-2 rounded-DEFAULT border border-outline-variant/20">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">In</span>
                                        <span className={`font-tabular-nums text-body-sm ${rec.inColor || 'text-on-surface'}`}>{rec.clockIn}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Out</span>
                                        <span className="font-tabular-nums text-body-sm text-on-surface">{rec.clockOut}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Total</span>
                                        <span className={`font-tabular-nums text-body-sm ${rec.outColor || 'font-medium'}`}>{rec.totalHrs}</span>
                                    </div>
                                </div>
                                <button className="mt-1 w-full flex items-center justify-center gap-1 min-h-[44px] text-primary hover:bg-primary-container/20 rounded-DEFAULT transition-colors text-label-md font-label-md">
                                    <span className="material-symbols-outlined text-[16px]">edit_document</span>
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-3 md:px-md py-3 md:py-sm border-t border-outline-variant/30 bg-surface-container-lowest flex flex-col sm:flex-row justify-between items-center gap-4 text-body-sm text-on-surface-variant">
                        <div className="text-center sm:text-left">Showing 1 to 5 of 142 entries</div>
                        <div className="flex items-center gap-1 flex-wrap justify-center">
                            <button className="min-h-[44px] min-w-[44px] rounded hover:bg-surface-container-high transition-colors disabled:opacity-50 flex items-center justify-center" disabled>
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            <button className="min-h-[44px] min-w-[44px] rounded-DEFAULT bg-primary-container text-on-primary-container font-medium flex items-center justify-center">1</button>
                            <button className="min-h-[44px] min-w-[44px] rounded-DEFAULT hover:bg-surface-container-high transition-colors flex items-center justify-center">2</button>
                            <button className="min-h-[44px] min-w-[44px] rounded-DEFAULT hover:bg-surface-container-high transition-colors flex items-center justify-center">3</button>
                            <span className="px-2">...</span>
                            <button className="min-h-[44px] min-w-[44px] rounded-DEFAULT hover:bg-surface-container-high transition-colors flex items-center justify-center">15</button>
                            <button className="min-h-[44px] min-w-[44px] rounded hover:bg-surface-container-high transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
