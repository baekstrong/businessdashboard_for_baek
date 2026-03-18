import { useState } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus, Clock, FileText } from 'lucide-react'
import ChannelBadge from '../components/ChannelBadge'
import StatusBadge from '../components/StatusBadge'
import { scheduledContents, CHANNELS } from '../data/mockData'

export default function ContentCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [newContent, setNewContent] = useState({
    title: '', channel: 'youtube', date: format(new Date(), 'yyyy-MM-dd'),
    time: '12:00', type: '스레드', status: 'draft',
  })

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = []
  let day = calStart
  while (day <= calEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  const getContentsForDay = (date) =>
    scheduledContents.filter((c) => c.date === format(date, 'yyyy-MM-dd'))

  const selectedContents = getContentsForDay(selectedDate)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">콘텐츠 캘린더</h2>
          <p className="text-sm text-slate-500 mt-1">콘텐츠 예약 발행 관리</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} />
          콘텐츠 추가
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-lg">
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-base font-semibold text-slate-900">
              {format(currentMonth, 'yyyy년 M월', { locale: ko })}
            </h3>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-lg">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-lg overflow-hidden">
            {['월', '화', '수', '목', '금', '토', '일'].map((d) => (
              <div key={d} className="bg-slate-50 py-2 text-center text-xs font-medium text-slate-500">
                {d}
              </div>
            ))}
            {days.map((day, i) => {
              const contents = getContentsForDay(day)
              const isToday = isSameDay(day, new Date())
              const isSelected = isSameDay(day, selectedDate)
              const isCurrentMonth = isSameMonth(day, currentMonth)

              return (
                <div
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={`bg-white min-h-[80px] p-1.5 cursor-pointer transition-colors
                    ${!isCurrentMonth ? 'opacity-40' : ''}
                    ${isSelected ? 'ring-2 ring-primary ring-inset' : 'hover:bg-slate-50'}
                  `}
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs
                    ${isToday ? 'bg-primary text-white font-bold' : 'text-slate-700'}`}
                  >
                    {format(day, 'd')}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {contents.slice(0, 3).map((c) => (
                      <div
                        key={c.id}
                        className="text-[10px] leading-tight px-1 py-0.5 rounded truncate"
                        style={{
                          backgroundColor: CHANNELS[c.channel]?.bg,
                          color: CHANNELS[c.channel]?.color,
                        }}
                      >
                        {c.title}
                      </div>
                    ))}
                    {contents.length > 3 && (
                      <p className="text-[10px] text-slate-400 px-1">+{contents.length - 3}개</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Day Detail */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            {format(selectedDate, 'M월 d일 (EEEE)', { locale: ko })}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            {selectedContents.length > 0
              ? `${selectedContents.length}개 콘텐츠`
              : '예정된 콘텐츠 없음'}
          </p>

          {selectedContents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <FileText size={32} className="mb-2" />
              <p className="text-sm">이 날에 예정된 콘텐츠가 없습니다</p>
              <button
                onClick={() => {
                  setNewContent((prev) => ({ ...prev, date: format(selectedDate, 'yyyy-MM-dd') }))
                  setShowModal(true)
                }}
                className="mt-3 text-xs text-primary hover:underline"
              >
                + 콘텐츠 추가하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedContents.map((content) => (
                <div key={content.id} className="p-3 rounded-lg border border-border hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <ChannelBadge channel={content.channel} />
                    <StatusBadge status={content.status} />
                  </div>
                  <p className="text-sm font-medium text-slate-800">{content.title}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={12} />
                      {content.time}
                    </span>
                    <span className="text-xs text-slate-400">{content.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Content Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">콘텐츠 추가</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">제목</label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="콘텐츠 제목을 입력하세요"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">채널</label>
                  <select
                    value={newContent.channel}
                    onChange={(e) => setNewContent({ ...newContent, channel: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="threads">Threads</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">유형</label>
                  <select
                    value={newContent.type}
                    onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="롱폼">롱폼</option>
                    <option value="숏폼">숏폼</option>
                    <option value="스레드">스레드</option>
                    <option value="릴스">릴스</option>
                    <option value="카드뉴스">카드뉴스</option>
                    <option value="스토리">스토리</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">날짜</label>
                  <input
                    type="date"
                    value={newContent.date}
                    onChange={(e) => setNewContent({ ...newContent, date: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">시간</label>
                  <input
                    type="time"
                    value={newContent.time}
                    onChange={(e) => setNewContent({ ...newContent, time: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
